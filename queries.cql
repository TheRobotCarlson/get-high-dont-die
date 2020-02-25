// Gets the number of reactions for each drug
MATCH (d:Drug)-[]->(interaction:Interaction)-[]->(reaction:Reaction) return d.name, count(reaction) as val order by val DESC

// unique drug interactions
MATCH (d1:Drug)-[]->(interaction:Interaction)<-[]-(d2:Drug) 
where d1.name > d2.name 
return d1.name, d2.name, count(interaction) as val order by val DESC


// drug interactions for drug combos
MATCH (d1:Drug)-[]->(interaction:Interaction)<-[]-(d2:Drug) 
where d1.name > d2.name and d1.name in ["REMICADE", "VIOXX", "CARDIZEM"] 
return d1.name, d2.name, count(interaction) as val order by val DESC


// find interactions and rates of interactions
MATCH (d1:Drug)-[]->(interaction:Interaction)-[]->(reaction:Reaction) 
where d1.name in ["REMICADE", "VIOXX", "CARDIZEM"] 
return d1.name, reaction.name, count(reaction) as val order by val DESC

// get only the deadly ones
MATCH (d1:Drug)-[]->(interaction:Interaction)-[]->(reaction:Reaction) 
where d1.name in ["REMICADE", "VIOXX", "CARDIZEM"] and d1.data contains '"drugcharacterization": "1"'

return d1.name, reaction.name, count(reaction) as val order by val DESC



MATCH (d1:Drug)-[]->(interaction:Interaction)<-[]-(d2:Drug) 
where d1.name > d2.name and d1.name in ["REMICADE", "VIOXX", "CARDIZEM"] 
return d1.name, d2.name, size(collect((interaction)-[]->(:Reaction))) as val order by val DESC

MATCH (d1:Drug)-[]->(interaction:Interaction)<-[]-(d2:Drug) 
where d1.name > d2.name and d1.name in ["REMICADE", "VIOXX", "CARDIZEM"] 
return d1.name, d2.name, collect((interaction)-[]->(:Reaction)), size(collect((interaction)-[]->(:Reaction))) as val order by val DESC