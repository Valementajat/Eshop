# Quick Start Guide

## Requirements
- Docker Desktop
- Git
- VS Code
- Node.js

## Steps
1. **Download and Install Required Software:**
    - [Docker Desktop](https://www.docker.com/products/docker-desktop)
        - After installation, you may encounter a "Docker failed to initialize" error. Use a terminal to kill the Docker process and restart.
        - You need to install WSL. Use CMD or Windows PowerShell to run:
        ```
        wsl --update
        ```
    - [Git](https://git-scm.com/)
    - [VS Code](https://code.visualstudio.com/)
    - [Node.js](https://nodejs.org/)

2. **Clone the Repository:**
    ```
    git clone <repository_url>
    ```
    Make sure to replace `<repository_url>` with the actual URL of the repository.

3. **Build and Run the Docker Environment:**
    Navigate to the root folder of the project in the terminal and run:
    ```
    docker-compose up --build
    ```

4. **Access the Environment:**
    After the environment has started, access it through your web browser using the following URL:
    ```
    localhost
    ```
    If it's not running on the default port, use the port specified, e.g., `localhost:80`.

5. **Make Custom Commands:**
    To simplify certain operations, you can use the custom `make` command. Add the following function to your bash profile or bashrc file:
    ```
    code ~/.bashrc
    ```
    and add

    ```bash
    function make() {
        case $1 in
            "up")
                docker-compose up --build
                ;;
            "schema")
                docker-compose exec mysql_db mysqldump -uMYSQL_USER -pMYSQL_PASSWORD eshop > setup.sql
                ;;
            "down")
                docker-compose down
                ;;
            "check")
                docker ps
                ;;
            "rebuild-api")
                docker-compose up --no-deps --build -d api
                ;;
            "rebuild-nginx")
                docker-compose up --no-deps --build -d nginx
                ;;
            "rebuild-client")
                docker-compose up --no-deps --build -d client
                ;;  
            "rebuild-db")
                docker-compose up --no-deps --build -d mysql_db
                ;;
            "stop")
                docker-compose stop
                ;;
            # Add more cases for other custom commands here
            *)
                echo "Command not found. Available commands: up, schema, down, check, rebuild-api, rebuild-nginx, rebuild-client, rebuild-db, stop"
                ;;
        esac
    }

    ```
    Save the file and run `source ~/.bashrc` to apply the changes. Now, you can use the `make` command followed by your custom command, e.g., `make build` or `make schema`.

6. **Access the Database:**
    You can use a tool such as DBeaver to access the database. Configure the tool with the following details:
    - Host: localhost
    - Database: eshop
    - Username: root
    - Password: MYSQL_ROOT_PASSWORD
    - Ensure that allowPublicKeyRetrieval is enabled from:
    ``` 
    Open DBeaver and navigate to the connection settings for your MySQL connection.

    In the connection settings, locate the "Driver properties" or "Connection settings" section.

    Add the following parameter to the connection URL or the driver properties:

    allowPublicKeyRetrieval=true
    ```

    Alternatively, you can add the following configuration to your .yaml file:
    ```yaml
    adminer:
      image: adminer:latest
      restart: unless-stopped
      ports:
        - 8000:8080
      depends_on:
        - mysql_db
      environment:
        ADMINER_DEFAULT_SERVER: mysql_db
    ```
    Access it from the web browser port 8000.

## Notes
- Make sure that no other services are running on the ports that the project intends to use or change the port from docker-compose.yaml.
- Consult the project's documentation for any specific configurations or environment variables needed.
- Make schema will give out an error:
``` 
$ make schema
mysqldump: [Warning] Using a password on the command line interface can be insecure.
mysqldump: Error: 'Access denied; you need (at least one of) the PROCESS privilege(s) for this operation' when trying to dump tablespaces
```
  but it will work perfectly
