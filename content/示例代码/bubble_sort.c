#include <stddef.h>
#include <stdio.h>

static void swap(int *left, int *right)
{
    int temporary = *left;
    *left = *right;
    *right = temporary;
}

static void bubble_sort(int values[], size_t length)
{
    size_t pass;

    if (length < 2) {
        return;
    }

    for (pass = 0; pass + 1 < length; ++pass) {
        size_t index;
        int swapped = 0;

        for (index = 0; index + 1 < length - pass; ++index) {
            if (values[index] > values[index + 1]) {
                swap(&values[index], &values[index + 1]);
                swapped = 1;
            }
        }

        if (!swapped) {
            break;
        }
    }
}

static void print_values(const int values[], size_t length)
{
    size_t index;

    for (index = 0; index < length; ++index) {
        printf("%s%d", index == 0 ? "" : " ", values[index]);
    }
    putchar('\n');
}

int main(void)
{
    int values[] = {8, 6, 4, 7, 2};
    size_t length = sizeof values / sizeof values[0];

    fputs("Before: ", stdout);
    print_values(values, length);

    bubble_sort(values, length);

    fputs("After:  ", stdout);
    print_values(values, length);
    return 0;
}
