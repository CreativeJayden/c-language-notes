/* The course defines this calculator task; this complete program is supplementary. */
#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>

typedef double (*binary_operation)(double, double);

typedef struct {
    char symbol;
    binary_operation operation;
} operation_entry;

static double add(double left, double right)
{
    return left + right;
}

static double subtract(double left, double right)
{
    return left - right;
}

static double multiply(double left, double right)
{
    return left * right;
}

static double divide(double left, double right)
{
    return left / right;
}

int main(void)
{
    static const operation_entry operations[] = {
        {'+', add},
        {'-', subtract},
        {'*', multiply},
        {'/', divide}
    };
    char line[256];
    char operator_symbol;
    char trailing;
    double left;
    double right;
    double result;
    size_t operation_index;

    fputs("Enter an expression such as 12.5 * 4: ", stdout);
    fflush(stdout);

    if (fgets(line, sizeof line, stdin) == NULL) {
        fputs("No input was read.\n", stderr);
        return EXIT_FAILURE;
    }

    if (sscanf(line, " %lf %c %lf %c",
               &left, &operator_symbol, &right, &trailing) != 3) {
        fputs("Invalid input. Expected: number operator number\n", stderr);
        return EXIT_FAILURE;
    }

    for (operation_index = 0;
         operation_index < sizeof operations / sizeof operations[0];
         ++operation_index) {
        if (operations[operation_index].symbol == operator_symbol) {
            break;
        }
    }

    if (operation_index == sizeof operations / sizeof operations[0]) {
        fputs("Unsupported operator. Use +, -, *, or /.\n", stderr);
        return EXIT_FAILURE;
    }

    if (operator_symbol == '/' && right == 0.0) {
        fputs("Division by zero is not allowed.\n", stderr);
        return EXIT_FAILURE;
    }

    result = operations[operation_index].operation(left, right);
    printf("%.6g %c %.6g = %.6g\n",
           left, operator_symbol, right, result);
    return EXIT_SUCCESS;
}
