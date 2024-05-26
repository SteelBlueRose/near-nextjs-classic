const contractPerNetwork = {
  mainnet: 'hello.near-examples.near',
  testnet: 'danylobadenko.testnet',
};

const componentsPerNetwork = {
  mainnet: {
    socialDB: 'social.near',
  },
  testnet: {
    socialDB: 'v1.social08.testnet',
    TodoList: 'danylobadenko.testnet/widget/TodoList',
  }
};

export const NetworkId = 'testnet';
export const TodoListContract = contractPerNetwork[NetworkId];
export const Components = componentsPerNetwork[NetworkId];