import Wallet from './wallet';

let instance: any;

export default class MetamaskService extends Wallet {
  constructor(props?: any) {
    super(props);
  }

  getInstance = () => {
    if (instance == null) {
      instance = new MetamaskService();
      instance.constructor = null;
    }
    return instance;
  };

  removeInstance = () => {
    instance = null;
  };
}
