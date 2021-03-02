"use strict";

// SVG dimension variables
const width = 900,
      radius = width / 2;

const margin = { top: 10, right: 10, bottom: 10, left: 10 }

// Generator functions
const tree = d3.cluster().size([2 * Math.PI, radius - 100])

const svg = d3.create("svg");

function autoBox() {
    const c = document.querySelector("#vis-container")
    c.appendChild(this);
    const {x, y, width, height} = this.getBBox();
    return [x, y, width, height];
}

d3.json("https://raw.githubusercontent.com/d3/d3-hierarchy/v1.1.8/test/data/flare.json")
    .then(data => {

        // Root
        const root = tree(d3.hierarchy(data)
            .sort((a, b) => d3.ascending(a.data.name, b.data.name)));

        svg.append("g")
            .attr("fill", "none")
            .attr("stroke", "#555")
            .attr("stroke-opacity", 0.4)
            .attr("stroke-width", 1.5)
          .selectAll("path")
          .data(root.links())
          .join("path")
            .attr("d", d3.linkRadial()
                .angle(d => d.x)
                .radius(d => d.y));
        
        svg.append("g")
          .selectAll("circle")
          .data(root.descendants())
          .join("circle")
            .attr("transform", d => `
              rotate(${d.x * 180 / Math.PI - 90})
              translate(${d.y},0)
            `)
            .attr("fill", d => d.children ? "#555" : "#999")
            .attr("r", 2.5);
      
        svg.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("stroke-linejoin", "round")
            .attr("stroke-width", 3)
          .selectAll("text")
          .data(root.descendants())
          .join("text")
            .attr("transform", d => `
              rotate(${d.x * 180 / Math.PI - 90}) 
              translate(${d.y},0) 
              rotate(${d.x >= Math.PI ? 180 : 0})
            `)
            .attr("dy", "0.31em")
            .attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
            .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
            .text(d => d.data.name)
          .clone(true).lower()
            .attr("stroke", "white");

        svg.attr("viewBox", autoBox).node();
    }
)
