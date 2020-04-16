import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    let income = 0;
    let outcome = 0;
    for (let i = 0; i < this.transactions.length; i += 1) {
      if (this.transactions[i].type === 'income') {
        income += this.transactions[i].value;
      } else {
        outcome += this.transactions[i].value;
      }
    }
    const total = income - outcome;
    return { income, outcome, total };
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    if (type === 'outcome') {
      const { total } = this.getBalance();
      if (total - value < 0) {
        throw Error('user cannot spend more value than available');
      }
    }
    const transaction = new Transaction({ title, value, type });
    this.transactions.push(transaction);
    return transaction;
  }
}

export default TransactionsRepository;
