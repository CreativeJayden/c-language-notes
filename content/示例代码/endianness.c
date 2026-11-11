#include <stddef.h>
#include <stdio.h>

union Tag {
    unsigned int a;
    unsigned char ch[4];
};

int main(void)
{
    union Tag test = {0};
    size_t index;

    test.a = 0x12345678u;
    printf("a = %#x\n", test.a);

    for (index = 0; index < sizeof test.ch; ++index) {
        printf("ch[%zu]: %#x\n", index, test.ch[index]);
    }

    if (test.ch[0] == 0x78) {
        puts("Little-endian");
    } else if (test.ch[0] == 0x12) {
        puts("Big-endian");
    } else {
        puts("Unknown byte order");
    }

    return 0;
}
