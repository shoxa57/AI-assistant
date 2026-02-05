#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/stat.h>

// Функция для проверки существования файла
int file_exists(const char *filename) {
    struct stat buffer;
    return (stat(filename, &buffer) == 0);
}

int main() {
    printf("\033[1;36m====================================\033[0m\n");
    printf("\033[1;36m   SYSTEM GUARD ECOSYSTEM (C)     \033[0m\n");
    printf("\033[1;36m====================================\033[0m\n");
    
    while(1) {
        // 1. Проверка Python сервера (Port 8000)
        int port_status = system("lsof -i:8000 > /dev/null");

        // 2. Проверка базы данных
        int db_status = file_exists("../backend/chat_history.db");

        printf("\n[CHECKING SYSTEM STATUS...]\n");

        if (port_status == 0) {
            printf("\033[1;32m[OK]\033[0m Python Server: ACTIVE (Port 8000)\n");
        } else {
            printf("\033[1;31m[ALERT]\033[0m Python Server: DOWN!\n");
        }

        if (db_status) {
            printf("\033[1;32m[OK]\033[0m Database File: FOUND\n");
        } else {
            printf("\033[1;33m[WARN]\033[0m Database File: NOT FOUND (Run Python first)\n");
        }

        printf("------------------------------------\n");
        sleep(5); // Пауза 5 секунд
    }
    return 0;
}
