# Sentient Rockets Sandbox

Improved version of my previous project SmartRockets. Adding sensors to the rocket to make them able to sense its environment and react accordingly.

## Description

Rockets don't use a fixed sequence of commands anymore. Now they are controlled by a neural network that receives as the input, a list of boolean values representing the detection or not of an obstacle in front of the rocket, and in returns the predictions returns a fly instruction to the rocket (steering and thrust). The neural network of each rocket is generated randomly, and after each generation, the most successful rockets will be used as a base for the next generation of rockets. A mutation is added to its neurons, giving opportunities to improve performance, and then pass the learned features to the next generation.

## Rocket controls

Rockets fly instructions are thrust power, and steering.

If you want to test manually the rockets control parameters to understand the physics you can do it in this codepen:
https://codepen.io/daniel-servidie/pen/pogegWL

## Watch the neural network learn in from or your eyes in this deployed site:

https://dservidie.github.io/sentient-rockets/