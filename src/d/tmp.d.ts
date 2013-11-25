declare module Tmp{
	export function dir(callback: (err: any, path: string) => void) : void;
}

declare module "tmp"{
	export = Tmp;
}