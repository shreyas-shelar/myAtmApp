import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AVAILABLE_NOTES } from './availableNotes';
import { Transaction } from './transaction';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'myAtmApp';

  public depositForm = new FormGroup({
    available2000: new FormControl(''),
    available500: new FormControl(''),
    available200: new FormControl(''),
    available100: new FormControl(''),
  });

  public withdrawalForm = new FormGroup({
    amount: new FormControl('')
  });

  public availableCounter2000: number = 0;
  public availableCounter500: number = 0;
  public availableCounter200: number = 0;
  public availableCounter100: number = 0;
  public totalAmount: number = 0;
  public withdrawalAmount: number = 0;
  public depositCounter2000: number = 0;
  public depositCounter500: number = 0;
  public depositCounter200: number = 0;
  public depositCounter100: number = 0;
  public withdrawCounter2000: number = 0;
  public withdrawCounter500: number = 0;
  public withdrawCounter200: number = 0;
  public withdrawCounter100: number = 0;
  public transactionsList: Transaction[] = [];
  public availableNotes = AVAILABLE_NOTES;

  constructor() { }

  ngOnInit() {
    this._displayAvailableNotes();
  }

  private _displayAvailableNotes() {
    this.availableCounter2000 = this.availableNotes.get(2000)!;
    this.availableCounter500 = this.availableNotes.get(500)!;
    this.availableCounter200 = this.availableNotes.get(200)!;
    this.availableCounter100 = this.availableNotes.get(100)!;
    this._getTotal();
  }

  public deposit() {
    this.depositCounter2000 = this.depositForm.value.available2000 ? parseInt(this.depositForm.value.available2000) : 0;
    this.depositCounter500 = this.depositForm.value.available500 ? parseInt(this.depositForm.value.available500) : 0;
    this.depositCounter200 = this.depositForm.value.available200 ? parseInt(this.depositForm.value.available200) : 0;
    this.depositCounter100 = this.depositForm.value.available100 ? parseInt(this.depositForm.value.available100) : 0;

    this.availableCounter2000 += this.depositCounter2000;
    this.availableCounter500 += this.depositCounter500;
    this.availableCounter200 += this.depositCounter200;
    this.availableCounter100 += this.depositCounter100;
    this._setCounters();
    this._getTotal();
    this._logTransaction("deposit");
    this._resetForm("deposit");
  }

  private _logTransaction(action: string) {
    let transaction: Transaction = {
      isSuccess: false,
      details: "",
      date: new Date()
    }
    if (action == "deposit") {
      transaction.isSuccess = true;
      transaction.details = `Deposit 2000:${this.depositCounter2000}, 500:${this.depositCounter500}, 200:${this.depositCounter200}, 100:${this.depositCounter100}`;
      transaction.date = new Date();
      this.transactionsList.push(transaction);
      console.log(this.transactionsList);
    } else if (action == "withdraw") {
      transaction.isSuccess = true;
      transaction.details = `Withdraw [${this.withdrawalAmount}] 2000:${this.withdrawCounter2000}, 500:${this.withdrawCounter500}, 200:${this.withdrawCounter200}, 100:${this.withdrawCounter100}`;
      transaction.date = new Date();
      this.transactionsList.push(transaction);
      console.log(this.transactionsList);
    } else if (action == "failure") {
      transaction.isSuccess = false;
      transaction.details = "Cannot Withdraw";
      transaction.date = new Date();
      this.transactionsList.push(transaction);
      console.log(this.transactionsList);
    }
  }

  private _setCounters() {
    this.availableNotes.set(2000, this.availableCounter2000);
    this.availableNotes.set(500, this.availableCounter500);
    this.availableNotes.set(200, this.availableCounter200);
    this.availableNotes.set(100, this.availableCounter100);
  }

  private _getTotal() {
    this.totalAmount = (this.availableCounter2000 * 2000) + (this.availableCounter500 * 500) +
      (this.availableCounter200 * 200) + (this.availableCounter100 * 100);
  }

  public withdraw() {
    this.withdrawalAmount = this.withdrawalForm.value.amount ? parseInt(this.withdrawalForm.value.amount) : 0;
    let amount = this.withdrawalAmount;
    let flag: boolean = false;
    if (amount <= this.totalAmount && amount > 0 && this._isMultipleOf100(amount)) {
      while (amount != 0 && !flag) {
        if (amount >= 2000 && this.availableCounter2000 > 0) {
          this.withdrawCounter2000 = Math.floor(amount / 2000);
          if (!(this.availableCounter2000 >= this.withdrawCounter2000)) {
            this.withdrawCounter2000 = this.availableCounter2000;
            this.availableCounter2000 -= this.availableCounter2000;
            amount -= this.withdrawCounter2000 * 2000;
          } else {
            amount -= this.withdrawCounter2000 * 2000;
            this.availableCounter2000 -= this.withdrawCounter2000;
          }
        } else if (amount >= 500 && this.availableCounter500 > 0) {
          this.withdrawCounter500 = Math.floor(amount / 500);
          if (!(this.availableCounter500 >= this.withdrawCounter500)) {
            this.withdrawCounter500 = this.availableCounter500;
            this.availableCounter500 -= this.availableCounter500;
            amount -= this.withdrawCounter500 * 500;
          } else {
            amount -= this.withdrawCounter500 * 500;
            this.availableCounter500 -= this.withdrawCounter500;
          }
        } else if (amount >= 200 && this.availableCounter200 > 0) {
          this.withdrawCounter200 = Math.floor(amount / 200);
          if (!(this.availableCounter200 >= this.withdrawCounter200)) {
            this.withdrawCounter200 = this.availableCounter200;
            this.availableCounter200 -= this.availableCounter200;
            amount -= this.withdrawCounter200 * 200;
          } else {
            amount -= this.withdrawCounter200 * 200;
            this.availableCounter200 -= this.withdrawCounter200;
          }
        } else if (amount >= 100 && this.availableCounter100 > 0) {
          this.withdrawCounter100 = Math.floor(amount / 100);
          if (!(this.availableCounter100 >= this.withdrawCounter100)) {
            this.withdrawCounter100 = this.availableCounter100;
            this.availableCounter100 -= this.availableCounter100;
            amount -= this.withdrawCounter100 * 100;
          } else {
            amount -= this.withdrawCounter100 * 100;
            this.availableCounter100 -= this.withdrawCounter100;
          }
        } else {
          flag = true;
          this._unableToWithdraw();
        }
      }
      if (!flag) {
        this._getTotal();
        this._logTransaction("withdraw");
        this._clearWithdrawalCounters();
      }
    } else {
      this._unableToWithdraw();
    }
    this._resetForm("withdraw");
  }

  private _isMultipleOf100(withdrawalAmount: number) {
    return withdrawalAmount % 100 === 0;
  }

  private _clearWithdrawalCounters() {
    this.withdrawCounter2000 = 0;
    this.withdrawCounter500 = 0;
    this.withdrawCounter200 = 0;
    this.withdrawCounter100 = 0;
  }

  private _unableToWithdraw() {
    this._logTransaction("failure");
    this._resetForm("withdraw");
  }

  private _resetForm(target: string) {
    if (target == "deposit") {
      this.depositForm.reset();
    } else if (target == "withdraw") {
      this.withdrawalForm.reset();
    }
  }

}
