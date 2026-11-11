#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define STUDENT_CAPACITY 100

typedef struct Student {
    int id;
    char name[32];
    char gender[8];
    int age;
    char tel[16];
    double score;
} Student;

static int parse_student(const char *line, Student *student)
{
    int fields = sscanf(
        line,
        "%d,%31[^,],%7[^,],%d,%15[^,],%lf",
        &student->id,
        student->name,
        student->gender,
        &student->age,
        student->tel,
        &student->score
    );

    return fields == 6;
}

static void print_student(const Student *student)
{
    printf("%d,%s,%s,%d,%s,%.1f\n",
           student->id,
           student->name,
           student->gender,
           student->age,
           student->tel,
           student->score);
}

int main(int argc, char *argv[])
{
    const char *path = argc > 1 ? argv[1] : "students.csv";
    FILE *fp;
    Student students[STUDENT_CAPACITY];
    char line[256];
    size_t count = 0;
    unsigned long line_number = 0;
    unsigned long invalid_count = 0;
    double total = 0.0;

    if (argc > 2) {
        fprintf(stderr, "usage: %s [students.csv]\n", argv[0]);
        return EXIT_FAILURE;
    }

    fp = fopen(path, "r");
    if (fp == NULL) {
        perror(path);
        return EXIT_FAILURE;
    }

    while (fgets(line, sizeof line, fp) != NULL) {
        ++line_number;

        if (strchr(line, '\n') == NULL && !feof(fp)) {
            int ch;

            while ((ch = fgetc(fp)) != '\n' && ch != EOF) {
                /* Discard the rest of an overlong line. */
            }

            fprintf(stderr,
                    "line %lu: record is longer than %zu bytes\n",
                    line_number,
                    sizeof line - 1);
            ++invalid_count;
            continue;
        }

        line[strcspn(line, "\r\n")] = '\0';
        if (line[0] == '\0') {
            continue;
        }

        if (count == STUDENT_CAPACITY) {
            fprintf(stderr,
                    "student capacity %d exceeded\n",
                    STUDENT_CAPACITY);
            ++invalid_count;
            break;
        }

        if (!parse_student(line, &students[count])) {
            fprintf(stderr, "line %lu: invalid student record\n", line_number);
            ++invalid_count;
            continue;
        }

        ++count;
    }

    if (ferror(fp)) {
        perror("read");
        fclose(fp);
        return EXIT_FAILURE;
    }

    if (fclose(fp) != 0) {
        perror("fclose");
        return EXIT_FAILURE;
    }

    if (invalid_count != 0) {
        fprintf(stderr, "rejected %lu invalid record(s)\n", invalid_count);
        return EXIT_FAILURE;
    }

    if (count == 0) {
        fprintf(stderr, "no student records found in %s\n", path);
        return EXIT_FAILURE;
    }

    for (size_t i = 0; i < count; ++i) {
        print_student(&students[i]);
        total += students[i].score;
    }

    printf("read %zu records, average score %.2f\n", count, total / (double)count);
    return EXIT_SUCCESS;
}
