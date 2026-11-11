#include <stdbool.h>
#include <stdio.h>

#define ARRAY_STACK_CAPACITY 6

typedef struct {
    int data[ARRAY_STACK_CAPACITY];
    int top;
} ArrayStack;

static void array_stack_init(ArrayStack *stack)
{
    stack->top = -1;
}

static bool array_stack_is_empty(const ArrayStack *stack)
{
    return stack->top == -1;
}

static bool array_stack_push(ArrayStack *stack, int value)
{
    if (stack->top == ARRAY_STACK_CAPACITY - 1) {
        return false;
    }

    stack->data[++stack->top] = value;
    return true;
}

static bool array_stack_pop(ArrayStack *stack, int *out)
{
    if (array_stack_is_empty(stack)) {
        return false;
    }

    *out = stack->data[stack->top--];
    return true;
}

static bool array_stack_peek(const ArrayStack *stack, int *out)
{
    if (array_stack_is_empty(stack)) {
        return false;
    }

    *out = stack->data[stack->top];
    return true;
}

int main(void)
{
    ArrayStack array_stack;
    int value;

    array_stack_init(&array_stack);
    (void)array_stack_push(&array_stack, 10);
    (void)array_stack_push(&array_stack, 20);
    (void)array_stack_push(&array_stack, 30);

    (void)array_stack_pop(&array_stack, &value);
    printf("array pop: %d\n", value);
    (void)array_stack_pop(&array_stack, &value);
    printf("array pop: %d\n", value);

    (void)array_stack_peek(&array_stack, &value);
    printf("array peek: %d\n", value);

    (void)array_stack_pop(&array_stack, &value);
    printf("array empty: %d\n", array_stack_is_empty(&array_stack));
    return 0;
}
