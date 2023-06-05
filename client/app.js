App = {
  contracts: {},

  init: () => {
    App.loadEthereum();
    App.loadAccount();
    App.loadContract();
  },

  loadEthereum: async () => {
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } else if (window.web3) {
      web3 = new Web3(window.web3.currentProvider);
    } else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  },

  loadAccount: async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    App.account = accounts[0];
  },

  loadContract: async () => {
    const response = await fetch("TasksContract.json");
    const taskContractJSON = await response.json();

    App.contracts.tasksContract = TruffleContract(taskContractJSON);
    App.contracts.tasksContract.setProvider(App.web3Provider);

    App.tasksContract = await App.contracts.tasksContract.deployed();
  },

  render: () => {
    document.getElementById("account").innerText = App.account;
  },

  createTask: async (title, description) => {
    const result = await App.tasksContract.createTask(title, description, {
      from: App.account,
    });
    console.log(result.logs[0].args);
  },
};

App.init();
