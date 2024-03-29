# How to run mqtt broker

1. Run with `docker compose up` or another container orchestration tool
2. The broker will be available at `<container_ip>:1883`. You can check it using `docker inspect <container_id> | grep -i ipaddress`
3. You can set the password using `mosquitto_passwd -c ./mqtt-broker/passwd <username> <password>`
4. Subscribe to a topic using `mosquitto_sub -h "<container_ip>" -p 1883 -t <topic> -u <username> -P <password>`
