/* Type definitions for a subset of isomorphic-git
 */

interface CloneOptions {
    fs: any;
    http: any;
    dir: string;
    gitdir?: string;
    url: string;
}

declare module "isomorphic-git" {
    interface clone {
        (options: CloneOptions): void
    }
}
