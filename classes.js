export class Student {
  #fio;
  #group;
  #speciality;

  constructor({ fio = "", group = "", speciality = "" }) {
    this.#fio = fio;
    this.#group = group;
    this.#speciality = speciality;
  }

  get fio() {
    return this.#fio;
  }

  set fio(fio) {
    this.#fio = fio;
  }

  get group() {
    return this.#group;
  }

  set group(group) {
    this.#group = group;
  }

  get speciality() {
    return this.#speciality;
  }

  set speciality(speciality) {
    this.#speciality = speciality;
  }

  showInfo() {
    console.log(
      `Fio: ${this.#fio}; Group: ${this.#group}; Speciality: ${
        this.#speciality
      }`
    );
  }
  getInfo() {
    return { fio: this.#fio, group: this.#group, speciality: this.#speciality };
  }
}

export class Progress extends Student {
  #attempt = 0;
  #scores = [];
  #test = "";

  constructor({ fio = "", group = "", speciality = "" }) {
    super({ fio, group, speciality });
  }

  set test(test) {
    this.#test = test;
  }

  get test() {
    return this.#test;
  }

  get attempt() {
    return this.#attempt;
  }

  get test() {
    return this.#test;
  }

  addAttempt({ score = 0, test = "" }) {
    if (test === this.#test) {
      this.#attempt += 1;
      this.#scores.push(score);
    } else {
      this.#test = test;
      this.#scores = [score];
      this.#attempt = 1;
    }
  }

  getAverageScore() {
    if (this.#attempt === 0) {
      console.log(`${this.fio} тесты не проходил`);
      return 0;
    }

    const avgScore =
      this.#scores.reduce((previousValue, number) => {
        return previousValue + number;
      }, 0) / this.#attempt;

    return avgScore;
  }

  showInfo() {
    const { fio, group, speciality } = super.getInfo();
    console.log(
      `Fio: ${fio}; Group: ${group}; Speciality: ${speciality}; Test:${
        this.#test
      }; Attempts:${this.#attempt}; Average Score: ${this.getAverageScore()} `
    );
  }
}
