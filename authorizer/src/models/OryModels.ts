/* eslint-disable no-use-before-define */
/* eslint-disable max-classes-per-file */
import { Namespace, SubjectSet, Context } from '@ory/keto-namespace-types';

class User implements Namespace {
    related: {
        manager: User[];
    };
}

class Group implements Namespace {
    related: {
        members: (User | Group)[];
    };
}

class Restaurant implements Namespace {
    related: {
        parents: (Module | Restaurant)[];
        viewers: SubjectSet<Group, 'members'>[];
    };

    permits = {
        view: (ctx: Context): boolean =>
            this.related.viewers.includes(ctx.subject) ||
            this.related.parents.traverse((p) => p.permits.view(ctx)),
    };
}

class Module implements Namespace {
    related: {
        parents: (Module | Restaurant)[];
        viewers: (User | SubjectSet<Group, 'members'>)[];
        owners: (User | SubjectSet<Group, 'members'>)[];
    };

    permits = {
        view: (ctx: Context): boolean =>
            this.related.parents.traverse((p) => p.permits.view(ctx)) ||
            this.related.viewers.includes(ctx.subject) ||
            this.related.owners.includes(ctx.subject),

        edit: (ctx: Context) => this.related.owners.includes(ctx.subject),
    };
}
