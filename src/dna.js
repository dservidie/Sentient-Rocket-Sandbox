class DNA {
	constructor(genes){
		// Recieves genes and create a dna object
		if (genes) {
			this.genes = genes;
		} else {
			// If no genes just create random dna
			this.genes = [];
			for (var i = 0; i < config.commandsAmount; i++) {
				// Gives random commands
				this.genes[i] = Rocket.createCommand(random(0.5, 1), random(-1, 1), random(config.commandDurationMin, config.commandDurationMax)); // Thrust, Steering, Duration
			}
		}
	}

	// Adds random mutation to the genes to add variance.
	mutation(mutationRate) {
		if(mutationRate < 0.01) mutationRate = 0.01;
		for(var g of this.genes) {
			// if random number less than mutationRate, gene mutates
			if (random(1) < mutationRate) {
				// config.mutationDeviation 
				g.thrust = this.limit( g.thrust + this.randomSign(random(0.1, config.mutationDeviation)) , 0.5, 1);
				g.steering = this.limit( g.steering + this.randomSign(random(0.1, config.mutationDeviation)) , -1, 1);
				g.duration = this.limit( g.duration + this.randomSign( config.commandDurationMin * random(0.1, config.mutationDeviation)) , config.commandDurationMin, config.commandDurationMax);
			}
		}
	}
	
	// Adds random mutation to the genes to add variance.
	clone() {
		let clonedGenes = [];
		for(var g of this.genes) {
			clonedGenes.push( Rocket.createCommand(g.thrust, g.steering, g.duration) ); // Thrust, Steering, Duration
		}
		return new DNA(clonedGenes);
	}
	
	randomSign(value){
		return Math.random() < 0.5 ? value * -1 : value;
	}
	
	limit(value, min, max){
		return (value < min ? min : 
						(value > max ? max : value)
					 );
	}	
}
