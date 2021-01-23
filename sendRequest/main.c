#include <stdlib.h>
#include <stdio.h>
#include "secret.h"

int main(int argc, char **argv){
    if(argc > 2){
    }else{
        printf("[-] Please send a value. For exemple :\n\t%s 17.5\n\tTo send 17.5\n", argv[0]);
    }
    return EXIT_SUCCESS;
}