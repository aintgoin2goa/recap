
declare function rimraf(file: string, callback: (err: any) => void): void;

declare module "rimraf"{
	export = rimraf;
}