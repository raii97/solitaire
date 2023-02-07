import React from "react";
import { render, screen } from "@testing-library/react";
import CardComponent from "../card";

describe("Card component", () => {
  it("renders the suit and number when flipped", () => {
    render(<Card flipped={true} suit="Spades" number="A" />);
    expect(screen.getByText(/Spades/)).toBeInTheDocument();
    expect(screen.getByText(/A/)).toBeInTheDocument();
  });
});


class Person {

  //this = { name: 'rai'}
  constructor(name) {
    this.name = name;
  }
  speak() {
    console.log("Hello");
  }

  sleep() {
    console.log("Zzz");
  }

  sayName() {
    console.log(`My name is ${this.name}`);
  }
}

const person = new Person('rai');
person.sayName()

const rai = new Person();
rai.speak();
rai.sleep();

const a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const dog = {
  name: "doggie",
  bark() {
    console.log("woof woof");
  },
};

dog.bark();
