/// <reference path="IDestinationType.ts" />   

interface IDestination {

    uri: string;

    type: DestinationType;

    setup(): Q.IPromise<any>;

}

