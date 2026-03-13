# Etapa 1: Compilación (Docker descarga Maven por ti)
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Etapa 2: Ejecución (Crea la imagen ligera)
FROM eclipse-temurin:21-jdk-jammy
WORKDIR /app
# Esta línea es la clave: copia el archivo generado en la etapa anterior
COPY --from=build /app/target/*.jar app.jar

# Cambia este puerto según el servicio (8082 para auth, 8083 para catalog, etc.)
EXPOSE 8084

ENTRYPOINT ["java", "-jar", "app.jar"]