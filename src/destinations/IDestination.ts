
interface IDestination {

    uri: string;

    setup(): Q.IPromise<any>;

}

