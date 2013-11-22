interface NP_ViewPortSize{
    width: number;
    height: number;
}

interface NP_Page{
    open(url: string, callback: (err: any, status: string) => void): void;
    close(callback: () => void): void;
    viewportSize: NP_ViewPortSize;
    render(filename: string, callback: (err: any) => void): void;
    set(property: string, value: any, callback: (err: any) => void): void;
    evaluate(func: () => void, callback: (err:any, urls:any) => void): void;
    onLoadFinished: () => void;
}
interface NP_Phantom{
    createPage(callback: (err: any, page: NP_Page) => void ): void;
    exit(callback: () => void ): void;
    on(event: string, callback: () => void ): void;
}

declare module "node-phantom" {
    export function create(callback: (err: any, phantom: NP_Phantom) => void): void;
}