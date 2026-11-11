#include <stdbool.h>
#include <stdio.h>

#define CIRCULAR_QUEUE_CAPACITY 6

typedef struct {
    int data[CIRCULAR_QUEUE_CAPACITY];
    int front;
    int rear;
} CircularQueue;

static void circular_queue_init(CircularQueue *queue)
{
    queue->front = 0;
    queue->rear = 0;
}

static bool circular_queue_is_empty(const CircularQueue *queue)
{
    return queue->front == queue->rear;
}

static bool circular_queue_is_full(const CircularQueue *queue)
{
    return (queue->rear + 1) % CIRCULAR_QUEUE_CAPACITY == queue->front;
}

static bool circular_queue_enqueue(CircularQueue *queue, int value)
{
    if (circular_queue_is_full(queue)) {
        return false;
    }

    queue->data[queue->rear] = value;
    queue->rear = (queue->rear + 1) % CIRCULAR_QUEUE_CAPACITY;
    return true;
}

static bool circular_queue_dequeue(CircularQueue *queue, int *out)
{
    if (circular_queue_is_empty(queue)) {
        return false;
    }

    *out = queue->data[queue->front];
    queue->front = (queue->front + 1) % CIRCULAR_QUEUE_CAPACITY;
    return true;
}

int main(void)
{
    CircularQueue circular;
    int value;

    circular_queue_init(&circular);
    for (int item = 10; item <= 50; item += 10) {
        (void)circular_queue_enqueue(&circular, item);
    }
    printf("circular full: %d\n", circular_queue_is_full(&circular));

    (void)circular_queue_dequeue(&circular, &value);
    printf("circular dequeue: %d\n", value);
    (void)circular_queue_dequeue(&circular, &value);
    printf("circular dequeue: %d\n", value);

    (void)circular_queue_enqueue(&circular, 60);
    (void)circular_queue_enqueue(&circular, 70);

    while (circular_queue_dequeue(&circular, &value)) {
        printf("circular dequeue: %d\n", value);
    }
    return 0;
}
