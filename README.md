## Description

This is a backend coding template demostartion service that enables customers to create sessions, upload images. It demostrate event emitter programming standards also.

## Running the app
Make that `.env` file is added. It will have all the configurations to run the application.

Build docker images
```shell
$ make init
```

Start the containers
```shell
$ make start
```
Stop the containers
```shell
$ make stop
```

After running the `make start`, run db migrate command in a new terminal. It will initialise the db with entities. 
```shell
$ make migrate
```
**Note:** Server should be in running state while running this command.

Other commands
To generate and create migrations, run:

```shell
$ make create-migration
$ make generate-migration
```

To revert a migration, run: 
```shell
$ make migrate-down
```


## Test

```bash
# unit tests
$ npm run test
```

## Design practices

In this project, Dependency Injection (DI) is used through interfaces in certain cases, such as with repositories. 

The primary reasons for this choice are to facilitate Test-Driven Development (TDD) and to promote loose coupling in services or any other components that depend on third parties.

This approach aligns [ISP](https://en.wikipedia.org/wiki/Interface_segregation_principle) aka `Interface Segregation principle` from SOLID principles.


## License

Nest is [MIT licensed](LICENSE).
