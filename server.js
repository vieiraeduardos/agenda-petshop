const { GraphQLServer } = require('graphql-yoga')

const conexao = require('./infraestrutura/conexao')
const Tabelas = require('./infraestrutura/database/tabelas')
const Operacoes = require('./infraestrutura/operations')

const Clientes = new Operacoes('cliente');
const Pets = new Operacoes('pet');

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || 'World'}`,
    sum: (_, {a, b}) => {
      return `${a} + ${b} = ` + (parseFloat(a) + parseFloat(b));
    },
    status: () => "OK Status",
    clientes: () => Clientes.lista(),
    cliente: (root, {id}) => {
      return Clientes.buscaPorId(id);
    },
    pets: () => Pets.lista(),
    pet: (root, { id }) => Pets.buscaPorId(id)

  },
  Mutation: {
    adicionarCliente: (root, params) => Clientes.adiciona(params),
    atualizarCliente: (root, params) => Clientes.atualiza(params),
    deletarCliente: (root, {id}) => Clientes.deleta(id),
    adicionarPet: (root, params) => Pets.adiciona(params),
    atualizarPet: (root, params) => Pets.atualiza(params),
    deletarPet: (root, {id}) => Pets.deleta(id),


  }
}

const servidor = new GraphQLServer({
  resolvers,
  typeDefs: './schema.graphql'
})

servidor.start(() => console.log('servidor ouvindo'))

conexao.connect(erro => {
  if (erro) {
    console.log(erro)
  }

  console.log('conectou no banco')

  Tabelas.init(conexao)
})

