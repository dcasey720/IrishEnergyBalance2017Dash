

queue()
    .defer(d3.json, "static/data/EnergyBalance2017FinalEnergyConsumption.json")
    .await(makeGraphsFinalEnergyConsumption);

queue()
    .defer(d3.json, "static/data/EnergyBalance2017PrimaryEnergyReq.json")
    .await(makeGraphsPrimaryEnergyReq);

queue()
    .defer(d3.json, "static/data/EnergyBalance2017Transformation.json")
    .await(makeGraphsTransformation);

function makeGraphsFinalEnergyConsumption(error, energyData) {
    var ndx = crossfilter(energyData);

    show_consumptionByConsumer_rowchart(ndx);
    show_consumptionByConsumer_piechart(ndx);

    show_consumptionByFuelType_barchart(ndx);
    show_consumptionFuel_piechart(ndx)

    dc.renderAll();
}

function makeGraphsPrimaryEnergyReq(error, energyData) {
    var ndx = crossfilter(energyData);

    show_supplyBySource_barchart(ndx);
    show_supplyFuel_piechart(ndx);
    dc.renderAll();
}

function makeGraphsTransformation(error, energyData) {
    var ndx = crossfilter(energyData);
    show_transformationInput_rowchart(ndx);
    show_transformationOutput_rowchart(ndx);
    dc.renderAll();
}




// Energy Consumption (ktoe) per consumer
function show_consumptionByConsumer_rowchart(ndx) {
    var consumer_dim = ndx.dimension(dc.pluck('subgroup'));
    var all = consumer_dim.groupAll().reduceSum(dc.pluck('value'));
    var total_perConsumer = consumer_dim.group().reduceSum(dc.pluck('value'));
    dc.rowChart("#consumptionByConsumer_rowchart")
        .height(300)
        .width(300)
        .margins({ top: 10, left: 10, right: 10, bottom: 20 })
        .transitionDuration(750)
        .dimension(consumer_dim)
        .group(total_perConsumer)
        .renderLabel(true)
        .labelOffsetY(20)
        .gap(9)
        .title(function (d) {
            return d.key + ':\n' + Math.round(d.value / all.value() * 100) + '%\n' + Math.round(d.value) + 'toe';
        })
        .elasticX(false)
        .xAxis().tickFormat(d3.format("s"));;
}

function show_consumptionByConsumer_piechart(ndx) {
    var consumerSub_dim = ndx.dimension(dc.pluck('record'));
    var all = consumerSub_dim.groupAll().reduceSum(dc.pluck('value'));
    var total_perConsumerSub = consumerSub_dim.group().reduceSum(dc.pluck('value'));
    dc.pieChart("#consumptionByConsumerSub_piechart")
        .height(100)
        .width(100)
        .transitionDuration(750)
        .radius(50)
        .innerRadius(30)
        .dimension(consumerSub_dim)
        .group(total_perConsumerSub)
        .title(function (d) {
            return d.key + ':\n' + Math.round(d.value / all.value() * 100) + '%\n' + Math.round(d.value) + 'toe';
        })
        .renderLabel(false);
}

// Energy Consumption (ktoe) per fuel, stack consumer bar chart
function show_consumptionByFuelType_barchart(ndx) {

    var fuelType_dim = ndx.dimension(dc.pluck('fuelType'));
    var all = fuelType_dim.groupAll().reduceSum(dc.pluck('value'));
    var total_perFuelType = fuelType_dim.group().reduceSum(dc.pluck('value'));

    var transport_perFuelType = fuelType_dim.group().reduceSum(function (d) {
        if (d.subgroup === 'Transport') {
            return +d.value;
        } else {
            return 0;
        }
    });

    var residential_perFuelType = fuelType_dim.group().reduceSum(function (d) {
        if (d.subgroup === 'Residential') {
            return +d.value;
        } else {
            return 0;
        }
    });

    var industry_perFuelType = fuelType_dim.group().reduceSum(function (d) {
        if (d.subgroup === 'Industry') {
            return +d.value;
        } else {
            return 0;
        }
    });

    var services_perFuelType = fuelType_dim.group().reduceSum(function (d) {
        if (d.subgroup === 'Services') {
            return +d.value;
        } else {
            return 0;
        }
    });

    var agriculture_perFuelType = fuelType_dim.group().reduceSum(function (d) {
        if (d.subgroup === 'Agriculture') {
            return +d.value;
        } else {
            return 0;
        }
    });

    var fisheries_perFuelType = fuelType_dim.group().reduceSum(function (d) {
        if (d.subgroup === 'Fisheries') {
            return +d.value;
        } else {
            return 0;
        }
    });

    consumptionByFuelType_barchart = dc.barChart("#consumptionByFuelType_barchart")
    consumptionByFuelType_barchart
        .width(400)
        .height(400)
        .margins({ top: 10, right: 50, bottom: 100, left: 50 })
        .dimension(fuelType_dim)
        .group(transport_perFuelType, 'Transport')
        .stack(residential_perFuelType, 'Residential')
        .stack(industry_perFuelType, 'Industry')
        .stack(services_perFuelType, 'Services')
        .stack(agriculture_perFuelType, 'Agriculture')
        .stack(fisheries_perFuelType, 'Fisheries')

        .centerBar(true)
        .brushOn(false)
        .title(function (d) {
            return d.key + ':\n' + Math.round(d.value / all.value() * 100) + '%\n' + Math.round(d.value) + 'toe';
        })
        .gap(1)
        .elasticY(true)
        .transitionDuration(750)
        .legend(dc.legend().x(250).y(0).itemHeight(15).gap(5))
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .renderHorizontalGridLines(true)
        .y(d3.scale.linear().domain([0, 5500000]))
        .yAxis().tickFormat(d3.format("s"));
}


function show_consumptionFuel_piechart(ndx) {
    var fuel_dim = ndx.dimension(dc.pluck('fuel'));
    var all = fuel_dim.groupAll().reduceSum(dc.pluck('value'));
    var total_perFuel = fuel_dim.group().reduceSum(dc.pluck('value'));
    dc.pieChart("#consumptionByFuel_piechart")
        .height(100)
        .width(100)
        .transitionDuration(750)
        .radius(50)
        .innerRadius(30)
        .dimension(fuel_dim)
        .group(total_perFuel)
        .title(function (d) {
            return d.key + ':\n' + Math.round(d.value / all.value() * 100) + '%\n' + Math.round(d.value) + 'toe';
        })
        .renderLabel(false);
}


// Energy Supply (ktoe) per source, bar chart
function show_supplyBySource_barchart(ndx) {

    var source_dim = ndx.dimension(dc.pluck('record'));
    var all = source_dim.groupAll().reduceSum(dc.pluck('value'));

    var coal_perSource = source_dim.group().reduceSum(function (d) {
        if (d.fuelType === 'Coal') {
            return +d.value;
        } else {
            return 0;
        }
    });
    var elec_perSource = source_dim.group().reduceSum(function (d) {
        if (d.fuelType === 'Electricity') {
            return +d.value;
        } else {
            return 0;
        }
    });

    var natgas_perSource = source_dim.group().reduceSum(function (d) {
        if (d.fuelType === 'Nat.Gas') {
            return +d.value;
        } else {
            return 0;
        }
    });

    var nRWaste_perSource = source_dim.group().reduceSum(function (d) {
        if (d.fuelType === 'Non-Re.Waste') {
            return +d.value;
        } else {
            return 0;
        }
    });

    var oil_perSource = source_dim.group().reduceSum(function (d) {
        if (d.fuelType === 'Oil') {
            return +d.value;
        } else {
            return 0;
        }
    });

    var peat_perSource = source_dim.group().reduceSum(function (d) {
        if (d.fuelType === 'Peat') {
            return +d.value;
        } else {
            return 0;
        }
    });

    var renew_perSource = source_dim.group().reduceSum(function (d) {
        if (d.fuelType === 'Renewables') {
            return +d.value;
        } else {
            return 0;
        }
    });

    consumptionByFuelType_barchart = dc.barChart("#supplyBySource_barchart")
    consumptionByFuelType_barchart
        .width(400)
        .height(300)
        .margins({ top: 10, right: 50, bottom: 100, left: 30 })
        .dimension(source_dim)
        .group(oil_perSource, 'Oil')
        .stack(natgas_perSource, 'Nat.Gas')
        .stack(coal_perSource, 'Coal')
        .stack(renew_perSource, 'Renewables')
        .stack(peat_perSource, 'Peat')
        .stack(nRWaste_perSource, 'non-Ren.Waste')
        .stack(elec_perSource, 'Electricity')

        .centerBar(true)
        .brushOn(false)
        .title(function (d) {
            return d.key + ':\n' + Math.round(d.value / all.value() * 100) + '%\n' + Math.round(d.value) + 'toe';
        })
        .gap(1)
        .elasticY(true)
        .legend(dc.legend().x(250).y(0).itemHeight(15).gap(5))
        .transitionDuration(750)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .renderHorizontalGridLines(true)
        .y(d3.scale.linear().domain([0, 5500000]))
        .ordering(function (d) { return +d.value })
        .yAxis().tickFormat(d3.format("s"));
}


function show_supplyFuel_piechart(ndx) {
    var fuel_dim = ndx.dimension(dc.pluck('fuelType'));
    var all = fuel_dim.groupAll().reduceSum(dc.pluck('value'));
    var total_perFuel = fuel_dim.group().reduceSum(dc.pluck('value'));
    dc.pieChart("#supplyByFuel_piechart")
        .height(100)
        .width(100)
        .transitionDuration(750)
        .radius(50)
        .innerRadius(30)
        .dimension(fuel_dim)
        .group(total_perFuel)
        .title(function (d) {
            return d.key + ':\n' + Math.round(d.value / all.value() * 100) + '%\n' + Math.round(d.value) + 'toe';
        })
        .renderLabel(false);
}



// Energy transformation inputs
function show_transformationInput_rowchart(ndx) {

    var tranIn_dim = ndx.dimension(function (d) {
        if (d.group === 'TransformationInput')
            return d.record;});
    var all = tranIn_dim.groupAll().reduceSum(dc.pluck('value'));
    var tranIn_total = tranIn_dim.group().reduceSum(function (d) {
        if (d.group === 'TransformationInput')
            return d.value*-1;});

    dc.rowChart("#transformationInput_rowchart")
        .height(300)
        .width(200)
        .margins({ top: 20, left: 0, right: 0, bottom: 20 })
        .transitionDuration(750)
        .dimension(tranIn_dim)
        .group(tranIn_total)
        .renderLabel(true)
        .labelOffsetY(20)
        .labelOffsetX(-20)
        .gap(20)
        .title(function (d) {
            return d.key + ':\n' + Math.round(d.value / all.value() * 100) + '%\n' + Math.round(d.value) + 'toe';})
        .elasticX(false)
        .ordering(function (d) { return +d.value })
        .xAxis().tickFormat(d3.format("s"));
}

// Energy transformation inputs
function show_transformationOutput_rowchart(ndx) {

    var tranOut_dim = ndx.dimension(function (d) {
        if (d.group === 'TransformationOutput')
            return d.record;
    });
    var all = tranOut_dim.groupAll().reduceSum(dc.pluck('value'));
    var tranOut_total = tranOut_dim.group().reduceSum(function (d) {
        if (d.group === 'TransformationOutput')
            return d.value;
    });

    dc.rowChart("#transformationOutput_rowchart")
        .height(300)
        .width(200)
        .margins({ top: 20, left: 0, right: 0, bottom: 20 })
        .transitionDuration(750)
        .dimension(tranOut_dim)
        .group(tranOut_total)
        .renderLabel(true)
        .gap(20)
        .title(function (d) {
            return d.key + ':\n' + Math.round(d.value / all.value() * 100) + '%\n' + Math.round(d.value) + 'toe';
        })
        .elasticX(true)
        .ordering(function (d) { return -d.value })
        .xAxis().tickFormat(d3.format("s"));
}



