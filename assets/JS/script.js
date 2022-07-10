$(function () {
    let countryName = $('#country-name');
    $('#country-name').focus();

    // Form submit return false in order to prevent page reload
    $('form').on('submit', () => {
        return false;
    });

    // Function that trigger's search on pressing enter
    countryName.on('keypress', (e) => {
        if (e.keyCode == 13) {
            $('#search-btn').trigger('click');
        }
    });

    // Function that clear countries data
    const hideTable = () => {
        $('#table-body,#region-table-body,#population').empty();
        $('.table').addClass('d-none');
    }

    $('#view-all-btn').on('click', (e) => {
        e.preventDefault();
        hideTable();
        apiCall('all');
    });

    // Function search countries
    $('#search-btn').on('click', (e) => {
        if (countryName.val() != '') {
            e.preventDefault();
            hideTable();
            apiCall(`name/${countryName.val()}`);
            countryName.val('');
        } else {
            swal('Error!', 'Please enter a country name!', 'error');
        }
    });

    // Function that send ajax and return data after
    const apiCall = (query) => {
        $.ajax({
            url: `https://restcountries.com/v3.1/${query}`,
            beforeSend: function () {
                $('#loader').removeClass('d-none');
            },
            success: function (res) {
                $('#loader').addClass('d-none');
                $('.table').removeClass('d-none');
                let totalCountries = res.length,
                    totalPopulation = 0,
                    avgPopulation = 0,
                    regionObj = [{
                            'name': 'Africa',
                            'numOfCountries': 0
                        },
                        {
                            'name': 'Americas',
                            'numOfCountries': 0
                        },
                        {
                            'name': 'Asia',
                            'numOfCountries': 0
                        },
                        {
                            'name': 'Europe',
                            'numOfCountries': 0
                        },
                        {
                            'name': 'Oceania',
                            'numOfCountries': 0
                        }
                    ];

                for (let i = 0; i < totalCountries; i++) {
                    regionObj.forEach((region) => {
                        if (res[i].region == region.name) {
                            region.numOfCountries += 1;
                        }
                    });
                    totalPopulation += res[i].population;
                    appendToCountriesTable(res[i].name.official, res[i].population
                        .toLocaleString());
                }
                avgPopulation = totalPopulation / totalCountries;
                appendPopulationData(totalCountries.toLocaleString(),totalPopulation.toLocaleString(), Math.floor(avgPopulation).toLocaleString())
                appendToRegionTable(regionObj);
            },
            error: function (req) {
                $('.table,#loader').addClass('d-none');
                if(req.status == 404) {
                    swal('Error!', 'Country not found!', 'error');
                }
            }
        });
    }

    // Function that appends data to countries table
    const appendToCountriesTable = (name, population) => {
        let content = `<tr>
                            <td>${name}</td>
                            <td>${population}</td>
                        </tr>`;
        $('#table-body').append(content);
    }

    // Function that add data to region table
    const appendToRegionTable = (obj) => {
        obj.forEach((region) => {
            content = `<tr>
                            <td>${region.name}</td>
                            <td>${region.numOfCountries}</td>
                        </tr>`;
            $('#region-table-body').append(content);
        });
    }

    // Function that add population and average population
    const appendPopulationData = (totalCountries,population, avgPopulation) => {
        let content = `<h3>Total Countries: ${totalCountries}</h3>
                    <h3>Total Countries Population: ${population}</h3>
                    <h3>Average Population: ${avgPopulation}</h3>`;
        $('#population').append(content);
    }
});