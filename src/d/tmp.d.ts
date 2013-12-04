declare module Tmp{
	export function dir(options: any, callback: (err: any, path: string) => void) : void;
}

declare module "tmp"{
	export = Tmp;
}