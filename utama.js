const express = require('express');

const { graphqlHTTP } = require('express-graphql');

const { 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLInt, 
    GraphQLNonNull, 
    GraphQLList, 
    GraphQLSchema 
} = require('graphql');

const app = express();

const PORT = 5000;


var Owners = [
    { id: 1, name: 'Bella' },
    { id: 2, name: 'Sintia' },
]

var items = [
    { id: 1, name: 'Mobil', ownerId: 1 },
    { id: 2, name: 'Motor', ownerId: 2 },
    { id: 3, name: 'Sepeda', ownerId: 2 },
    { id: 4, name: 'Kereta', ownerId: 1 },
    { id: 5, name: 'Pesawar', ownerId: 2 },
    { id: 6, name: 'Kapal', ownerId: 1},
    { id: 7, name: 'Gerobak', ownerId: 1 },
]

const itemType = new GraphQLObjectType({
    name: 'item',
    description: 'This represents a item made by a Owner (Programmer)',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLInt) }, 
        name: { type: new GraphQLNonNull(GraphQLString) }, 
        ownerId: { type: new GraphQLNonNull(GraphQLInt) },
    }),
});

const OwnerType = new GraphQLObjectType({
    name: 'Owner',
    description: 'This represents a Owner',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLInt) }, 
        name: { type: new GraphQLNonNull(GraphQLString) } 
    }),
});

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        // Get
        items: {
            type: new GraphQLList(itemType),
            description: 'List of All items',
            // return pada query
            resolve: () => items
        },
        owners: {
            type: new GraphQLList(OwnerType),
            description: 'List of All Owners',
            // return pada query
            resolve: () => Owners
        },
        // Get by id
        item: {
            type: itemType,
            description: 'A Single item',
            args: {
                id: { type: GraphQLInt }
            },
            // return pada query
            resolve: (parent, args) => items.find(item => item.id === args.id)
        },
        owner: {
            type: OwnerType,
            description: 'A Single Owner',
            args: {
                id: { type: GraphQLInt }
            },
            // return pada query
            resolve: (parent, args) => Owners.find(owner => owner.id === args.id)
        }
    })
})

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        additem: {
            type: itemType,
            description: 'Add a item',
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                ownerId: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve: (parent, args) => {
                const item = { 
                    id: items.length + 1, 
                    name: args.name, 
                    ownerId: args.ownerId 
                }
                items.push(item)
                return item
            }
        },
        removeitem: {
            type: itemType,
            description: 'Remove a item',
            args: {
                id: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve: (parent, args) => {
                items = items.filter(item => item.id !== args.id)
                return items[args.id]
            }
        },
        addOwner: {
            type: OwnerType,
            description: 'Add an Owner',
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: (parent, args) => {
                const owner = { id: Owners.length + 1, name: args.name }
                Owners.push(owner)
                return owner
            }
        },
        removeOwner: {
            type: OwnerType,
            description: 'Remove an Owner',
            args: {
                id: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve: (parent, args) => {
                Owners = Owners.filter(owner => owner.id !== args.id)
                return Owners[args.id]
            }
        },
        updateOwner: {
            type: OwnerType,
            description: 'Update an Owner',
            args: {
                id: { type: new GraphQLNonNull(GraphQLInt) },
                name: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: (parent, args) => {
                Owners[args.id - 1].name = args.name
                return Owners[args.id - 1]
            }
        },
        Updateitem: {
            type: itemType,
            description: 'Update a item',
            args: {
                id: { type: new GraphQLNonNull(GraphQLInt) },
                name: { type: new GraphQLNonNull(GraphQLString) },
                ownerId: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve: (parent, args) => {
                items[args.id - 1].name = args.name
                items[args.id - 1].ownerId = args.ownerId
                return items[args.id - 1]
            }
        }
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})

app.use('/graphql', graphqlHTTP({
    graphiql:true,
    schema:schema
}))

app.listen(PORT,() => {
    console.log(`App is listening on port ${PORT}`)
})