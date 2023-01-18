// https://jsonnet.org/learning/tutorial.html
function(ctx) {
	id: ctx.identity.id,
	username: ctx.identity.traits.email,
	newsletter: ctx.identity.traits.newsletter,
	name: ctx.identity.traits.name
}