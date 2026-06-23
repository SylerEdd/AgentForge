FROM maven:3.9-eclipse-temurin-17

RUN useradd --create-home --uid 10001 runner \
    && mkdir -p /opt/maven-cache \
    && chown -R runner:runner /opt/maven-cache /home/runner

ENV HOME=/home/runner
ENV MAVEN_CONFIG=/home/runner/.m2

COPY pom.xml /tmp/dependency-pom.xml

RUN mvn -B \
    -f /tmp/dependency-pom.xml \
    -Dmaven.repo.local=/opt/maven-cache \
    dependency:go-offline \
    && mvn -B \
    -Dmaven.repo.local=/opt/maven-cache \
    dependency:get \
    -Dartifact=org.apache.maven.surefire:surefire-junit-platform:3.2.5 \
    -Dtransitive=true \
    && chown -R runner:runner /opt/maven-cache /home/runner

WORKDIR /app

USER runner

CMD ["mvn", "-o", "-Dmaven.repo.local=/opt/maven-cache", "test"]