@echo off
echo ========================================================
echo     DESPLEGANDO BACKEND A EC2 AUTOMATICAMENTE
echo ========================================================
echo.
echo 1. Transfiriendo archivos del backend a tu instancia EC2...
scp -o StrictHostKeyChecking=no -i vockey.pem -r backend ubuntu@34.203.212.217:~/backend

echo.
echo 2. Instalando Java 21 y ejecutando el servidor en la nube...
ssh -o StrictHostKeyChecking=no -i vockey.pem ubuntu@34.203.212.217 "sudo apt update && sudo apt install -y openjdk-21-jdk && cd backend && chmod +x mvnw && ./mvnw spring-boot:run"

pause
