const prodeth = {
    allMatches: [],
    selectedMatch: null,
    matchesCounter: 0,
    renderMatches: (data) => {
        $(".no-results").show();
        for(let i = 0; i < data.length; i++){

            if(data[i].payed){
                //finished results
                $(".finished-bets .no-results").hide();
            } else if(new Date() >= new Date(data[i].date)){
                $(".closed-bets .no-results").hide();
                //closed results
            } else {
                $(".open-bets .no-results").hide();
                //open results
            }

            //check already rendered
            if(prodeth.allMatches.some(m => m.date === data[i].date && data[i].team1.country.code === m.team1.country.code && data[i].team2.country.code === m.team2.country.code) && $(`.match[team1='${data[i].team1.country.code}'][team2='${data[i].team2.country.code}'][date='${data[i].date}']`)){
                //update payoffs
                $(`.payoff-${data[i].team1.address}`).text(`x${parseFloat(data[i].team1.payoff).toFixed(2)} ETH`);
                $(`.payoff-${data[i].team2.address}`).text(`x${parseFloat(data[i].team2.payoff).toFixed(2)} ETH`);

                if(prodeth.selectedMatch != null &&
                    prodeth.selectedMatch.team1.country.code === data[i].team1.country.code &&
                    prodeth.selectedMatch.team2.country.code === data[i].team2.country.code &&
                    prodeth.selectedMatch.date === data[i].date && $("#match-details").hasClass("visible") &&
                    (data[i].team1.transactions.length > prodeth.selectedMatch.team1.transactions.length || 
                    data[i].team2.transactions.length > prodeth.selectedMatch.team2.transactions.length)){
                    //match details opened and new transaction incoming from one of the teams
                    
                    //update eth pool
                    $(`#pool-${data[i].team1.address}`).text(`${parseFloat(data[i].team1.balance).toFixed(3)} ETH`);
                    $(`#pool-${data[i].team2.address}`).text(`${parseFloat(data[i].team2.balance).toFixed(3)} ETH`);

                    //add new transactions for team1
                    for(let j=0; j<data[i].team1.transactions.length - prodeth.selectedMatch.team1.transactions.length; j++){
                        prodeth.addNewTransaction(data[i].team1.address, data[i].team1.transactions[j]);
                    }
                    //add new transactions for team2
                    for(let j=0; j<data[i].team2.transactions.length - prodeth.selectedMatch.team2.transactions.length; j++){
                        prodeth.addNewTransaction(data[i].team2.address, data[i].team2.transactions[j]);
                    }
                }
                continue;
            }
            if(data[i].payed){
                //finished
                $(".finished-bets").prepend(`
                <div class="row match small-match">
                    <div class="four wide computer six wide tablet column center aligned vertical-center">
                        <div class="ui tiny image" data-tooltip="${data[i].team1.country.name}">
                            <img src="/images/flags/${data[i].team1.country.flag}.png">
                        </div>
                        <div class='country-code'>${data[i].team1.country.code}</div>
                        <a class="ui big green label payoff payoff-${data[i].team1.address}" data-inverted="" data-tooltip="This was the final payoff for betting on ${data[i].team1.country.name}." data-position="bottom center">x${parseFloat(data[i].team1.payoff).toFixed(2)} ETH</a>
                    </div>
                    <div class="two wide computer four wide tablet column versus vertical-center">
                        VS
                    </div>
                    <div class="four wide computer six wide tablet column center aligned vertical-center">
                        <div class="ui tiny image" data-tooltip="${data[i].team2.country.name}">
                            <img src="/images/flags/${data[i].team2.country.flag}.png">
                        </div>
                        <div class='country-code'>${data[i].team2.country.code}</div>
                        <a class="ui big green label payoff payoff-${data[i].team2.address}" data-inverted="" data-tooltip="This was the final payoff for betting on ${data[i].team2.country.name}." data-position="bottom center">x${parseFloat(data[i].team2.payoff).toFixed(2)} ETH</a>
                    </div>
                    <div class="six wide computer sixteen wide tablet column center aligned vertical-center">
                        <a class="ui black button" style="margin-bottom: 0.5em;" target="_blank" href="http://www.fifa.com/worldcup/matches/">
                            <i class="external alternate icon"></i>
                            Match status
                        </a>
                        <div class="ui black button" id="match-details-${prodeth.matchesCounter}">
                            <i class="info circle icon"></i>
                            Bet details
                        </div>
                    </div>
                </div>
                `)   

                $(`#match-details-${prodeth.matchesCounter}`).click(()=>{
                    prodeth.matchDetails(data[i].team1.country.code,data[i].team2.country.code,data[i].date)
                });

                prodeth.matchesCounter++;

            } else if(new Date() >= new Date(data[i].date)){
                //closed
                
                $(".closed-bets").append(`
                    <div class="row match" team1="${data[i].team1.country.code}" team2="${data[i].team2.country.code}" date="${data[i].date}" >
                        <div class="six wide column center aligned">
                            <div class="ui tiny image" data-tooltip="${data[i].team1.country.name}">
                                <img src="/images/flags/${data[i].team1.country.flag}.png">
                            </div>
                            <div class="country-code">${data[i].team1.country.code}</div>
                            <a class="ui green big label payoff" data-inverted="" data-tooltip="This is the final payoff for betting ${data[i].team1.country.name}." data-position="bottom center">x${parseFloat(data[i].team1.payoff).toFixed(2)} ETH</a>
                        </div>
                        <div class="four wide column versus vertical-center">
                            VS
                        </div>
                        <div class="six wide column center aligned">
                            <div class="ui tiny image" data-tooltip="${data[i].team2.country.name}">
                                <img src="/images/flags/${data[i].team2.country.flag}.png">
                            </div>
                            <div class="country-code">${data[i].team2.country.code}</div>
                            <a class="ui green big label payoff" data-inverted="" data-tooltip="This is the final payoff for betting ${data[i].team2.country.name}." data-position="bottom center">x${parseFloat(data[i].team2.payoff).toFixed(2)} ETH</a>
                        </div>
                        <div class="sixteen wide column center aligned">
                            <div class="ui grid">
                                <div class="eight wide computer sixteen wide tablet column">
                                    <a class="ui black button" href="http://www.fifa.com/worldcup/matches/" target="_blank">
                                        <i class="external alternate icon"></i>
                                        Match status
                                    </a>
                                </div>
                                <div class="eight wide computer sixteen wide tablet column">
                                    <div class="ui black button" id="match-details-${prodeth.matchesCounter}">
                                        <i class="left info circle icon"></i>
                                        Bet status
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `)

                $(`#match-details-${prodeth.matchesCounter}`).click(()=>{
                    prodeth.matchDetails(data[i].team1.country.code,data[i].team2.country.code,data[i].date)
                });

                prodeth.matchesCounter++;
            } else {
                //open
                $(".open-bets").append(`
                    <div class="row match ${$(".open-bets .big-match").length >= 3 ? "small-match" : "big-match"}" team1="${data[i].team1.country.code}" team2="${data[i].team2.country.code}" date="${data[i].date}" >
                        <div class="five wide computer six wide tablet column center aligned vertical-center">
                            <div class="ui tiny image" data-tooltip="${data[i].team1.country.name}">
                                <img src="/images/flags/${data[i].team1.country.flag}.png">
                            </div>
                            <div class='country-code'>${data[i].team1.country.code}</div>
                            <a class="ui big green label payoff payoff-${data[i].team1.address}" data-inverted="" data-tooltip="This is the estimated payoff for betting on ${data[i].team1.country.name}." data-position="bottom center">x${parseFloat(data[i].team1.payoff).toFixed(2)} ETH</a>
                        </div>
                        <div class="two wide computer four wide tablet column versus vertical-center">
                            VS
                        </div>
                        <div class="five wide computer six wide tablet column center aligned vertical-center">
                            <div class="ui tiny image" data-tooltip="${data[i].team2.country.name}">
                                <img src="/images/flags/${data[i].team2.country.flag}.png">
                            </div>
                            <div class='country-code'>${data[i].team2.country.code}</div>
                            <a class="ui big green label payoff payoff-${data[i].team2.address}" data-inverted="" data-tooltip="This is the estimated payoff for betting on ${data[i].team2.country.name}." data-position="bottom center">x${parseFloat(data[i].team2.payoff).toFixed(2)} ETH</a>
                        </div>
                        <div class="four wide computer sixteen wide tablet column center aligned vertical-center">
                            <a class="ui black label timeleft" id='timeleft-${prodeth.matchesCounter}' data-inverted="" data-tooltip="Time left before bet closes and match starts." data-position="top center"></a>
                            <div class="ui primary button" id="match-details-${prodeth.matchesCounter}">
                                Bet now
                                <i class="right chevron icon"></i>
                            </div>
                        </div>
                    </div>
                `)   

                const countDownDate = new Date(data[i].date).getTime();

                const countdownFunction = (id, interval = null)=> {
                    const now = new Date().getTime();
                    const distance = countDownDate - now;
        
                    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
                    $(`#timeleft-${id}`).text(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        
                    if(distance / 1000 < 86400 && $(`#timeleft-${id}`).is('.black, .red')) {
                        //1 day left
                        $(`#timeleft-${id}`).removeClass("black red").addClass("yellow")
                    }

                    if(distance / 1000 < 3600 && $(`#timeleft-${id}`).is('.black, .yellow')) {
                        //one hour left
                        $(`#timeleft-${id}`).removeClass("black yellow").addClass("red")
                    }

                    if (distance / 1000 < 0) {
                        $(`#timeleft-${id}`).parent().parent().remove();
                        prodeth.renderMatches(prodeth.allMatches);
                    }
                }
                const countdownIntervalFunction = id => {
                    let interval = setInterval(() => {
                        countdownFunction(id, interval)
                    }, 1000);
                }

                countdownFunction(prodeth.matchesCounter);
                countdownIntervalFunction(prodeth.matchesCounter);

                $(`#match-details-${prodeth.matchesCounter}`).click(()=>{
                    prodeth.matchDetails(data[i].team1.country.code,data[i].team2.country.code,data[i].date)
                });

                prodeth.matchesCounter++;
            }
        }

        $(".loading").remove();

        prodeth.allMatches = data;

        if($(".open-bets .match.big-match").length < 3) {
            $(".open-bets .match").slice(0,3).removeClass("small-match").addClass("big-match")
        }
    },
    matchDetails: (code1, code2, date) => {
        const data = prodeth.allMatches.find(m => {
            if(m.team1.country.code === code1 && m.team2.country.code === code2 && m.date === date){
                return m;
            }
        })

        prodeth.selectedMatch = data;
        $(".modal#match-details").modal("show")
        $(".modal#match-details .content").html(`
        <div class="ui grid stackable">
            <div class="row">
                <div class="seven wide column center aligned">
                    <div class="ui image small">
                        <img src="/images/flags/${data.team1.country.flag}.png">
                    </div>
                    <div class='country-code'>${data.team1.country.name}</div>
                    <div class="ui green label big payoff payoff-${data.team1.address}">x${parseFloat(data.team1.payoff).toFixed(2)} ETH</div>
                    ${new Date() > new Date(data.date) ? (data.payed ? `<div class="ui black button big disabled">Match has ended</div>` : `<div class="ui black button big disabled">Match in progress</div>`) : `<div class="ui black button big" id="bet-team1">Bet on this team</div>`}
                    <div class="ui blue label large basic" style="margin-top:10px">
                        <a target="_blank" data-tooltip="Transactions" href="${etherscanURL}address/${data.team1.address}"><i class="icon external alternate"></i></a>
                        Pool 
                        <div class="detail" id='pool-${data.team1.address}'>${parseFloat(data.team1.balance).toFixed(3)} ETH</div>
                    </div>
                </div>
                <div class="two wide column versus vertical-center">
                    VS
                </div>
                <div class="seven wide column center aligned">
                    <div class="ui image small">
                        <img src="/images/flags/${data.team2.country.flag}.png">
                    </div>
                    <div class='country-code'>${data.team2.country.name}</div>
                    <div class="ui green label big payoff payoff-${data.team2.address}">x${parseFloat(data.team2.payoff).toFixed(2)} ETH</div>
                    ${new Date() > new Date(data.date) ? (data.payed ? `<div class="ui black button big disabled">Match has ended</div>` : `<div class="ui black button big disabled">Match in progress</div>`) : `<div class="ui black button big" id="bet-team2">Bet on this team</div>`}
                    <div class="ui blue label large basic" style="margin-top:10px">
                    <a target="_blank" data-tooltip="Transactions" href="${etherscanURL}address/${data.team2.address}"><i class="icon external alternate"></i></a>
                        Pool 
                        <div class="detail" id='pool-${data.team2.address}'>${parseFloat(data.team2.balance).toFixed(3)} ETH</div>
                    </div>
                </div>
            </div>
            ${(new Date() > new Date(data.date) && data.payed) ? `
            <div class="row">
                <div class="sixteen wide column center aligned">
                    <div class="ui label basic green big">
                        This match has been payed off
                    </div>
                </div>
            </div>
            ` : ``}
            <div class="row">
                <div class="eight wide column center aligned">
                    <table class="ui collapsing celled small table unstackable" style="width: 100%;">
                        <thead>
                            <tr>
                                <th colspan="2" style="text-align: center;">${data.team1.country.name}'s${new Date() > new Date(data.date) ? ` all bets`  : ` last bets<a class="ui red empty circular label live"></a>LIVE`}</th>
                            </tr>
                            <tr>
                                <th>From Address</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody id="transactions-${data.team1.address}">
                            ${data.team1.transactions.length <= 0 ? 
                                (new Date() > new Date(data.date)) ? 
                                    `
                                    <tr id="no-transactions-${data.team1.address}">
                                        <td colspan="2" style="text-align:center;"><p>There were no transactions.</p></td>
                                    </tr>
                                    ` :
                                    `
                                    <tr id="no-transactions-${data.team1.address}">
                                        <td colspan="2" style="text-align:center;"><p>There are no bets yet.</p><div class='ui label green'>The first bet of 0.01 ETH or more has a no fee bonus!</div></td>
                                    </tr>
                                    `
                            : data.team1.transactions.reduce((result, t) => {
                                return `${result+prodeth.addNewTransactionHTML(t)}`
                            }, "")
                             
                            }
                        </tbody>
                    </table>
                </div>
                <div class="eight wide column center aligned">
                    <table class="ui collapsing celled small table unstackable" style="width: 100%;">
                        <thead>
                            <tr>
                                <th colspan="2" style="text-align: center;">${data.team2.country.name}'s${new Date() > new Date(data.date) ? ` all bets`  : ` last bets<a class="ui red empty circular label live"></a>LIVE`}</th>
                            </tr>
                            <tr>
                                <th>From Address</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody id="transactions-${data.team2.address}">
                            ${data.team2.transactions.length <= 0 ? 
                                (new Date() > new Date(data.date)) ? 
                                    `
                                    <tr id="no-transactions-${data.team2.address}">
                                        <td colspan="2" style="text-align:center;"><p>There were no transactions.</p></td>
                                    </tr>
                                    ` :
                                    `
                                    <tr id="no-transactions-${data.team2.address}">
                                        <td colspan="2" style="text-align:center;"><p>There are no bets yet.</p><div class='ui label green'>The first bet of 0.01 ETH or more has a no fee bonus!</div></td>
                                    </tr>
                                    `
                            : data.team2.transactions.reduce((result, t) => {
                                return `${result+prodeth.addNewTransactionHTML(t)}`
                            }, "")

                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>`)

        $("#bet-team1").unbind().click(()=>{
            prodeth.bet(data, data.team1.country.code);
        })
        $("#bet-team2").unbind().click(()=>{
            prodeth.bet(data, data.team2.country.code);
        })
    },
    bet: (data, bettingFor) => {
        
        const goal = (bettingFor === data.team1.country.code) ? data.team1 : data.team2;

        $(".modal#bet").modal("show");
        $(".modal#bet .content").html(`
            <div class="ui image centered small">
                <img src="/images/flags/${goal.country.flag}.png">
            </div>
            <h2>You are betting for ${goal.country.name}.</h2>
            ${(typeof web3 !== "undefined") ?
                `
                <h3>How much would you like to bet on this team?</h3>
                <div class="ui right big labeled input">
                    <label for="amount" class="ui label">ETH</label>
                    <input type="number" placeholder="Amount" id="amount" step="0.01" min="0.01" value="0.01"> 
                </div>
                `
                :
                `
                <div class="ui floating message">
                    <div class="ui red inverted segment">
                        <b>IMPORTANT:</b> Do <b>NOT</b> send funds directly from exchanges to Prodeth's addresses. We cannot pay back to those wallets. <a href="/faq" target="_blank"><b>Read more</b></a>.
                    </div>
                    It seems you don't have <a href="https://metamask.io/">MetaMask</a> on your browser, but don't worry!
                    <br>
                    You can still do the bet by sending your desired amount to this match team address:
                    <pre class="pay-address">${goal.address}</pre>
                    <button class="ui teal right labeled icon button copy-button" data-clipboard-text="${goal.address}">
                        <i class="copy icon"></i>
                        Copy
                    </button>
                </div>
                `
            }         
        `)
        
        if(typeof web3 !== "undefined"){
            $(".modal#bet .actions #close").hide();
            $("#confirm-bet").unbind().click(()=>{
                web3.eth.sendTransaction({from: web3.eth.accounts[0], to: goal.address, gas:250000, value: web3.toWei($("#amount").val(),"ether") },function(err,txHash){
                    if(!err){
                        $("#success").modal("show").find(".content").html(`
                            <div class="ui container center aligned">
                                <i class="check icon" style="color:#21ba45; font-size:40px;"></i>
                                <h1>Transaction done!</h1>
                                <p>You can check the status of your transaction <a href="${etherscanURL}tx/${txHash}" target="_blank">here</a>!</p>
                                <p>Your bet will be valid once the transaction is validated by the <b>Ethereum Network</b>. Please wait a few minutes.</p>
                                <p>You can close this tiny window.</p>
                                <p style="font-family:Dusha; font-size:30px;">Go ${goal.country.name}!!</p>
                            </div>
                        `);
                    }
                })
            })
        } else {
            $(".modal#bet .actions #close").show();
            $(".modal#bet .actions .button").not("#close").hide();
        }
    },

    addNewTransaction: (address, transaction) => {
        $(`#no-transactions-${address}`).remove();
        $(`#transactions-${address}`).prepend(prodeth.addNewTransactionHTML(transaction));
    },
    addNewTransactionHTML: (transaction) =>{
        return `<tr>
            <td class="address-transaction"><a target="_blank" data-inverted="" data-tooltip="Transaction details" data-position="left center" href="${etherscanURL}tx/${transaction.id}"><i class="icon external alternate"></i></a> ${transaction.sender}</td>
            <td class="collapsing">${parseFloat(parseFloat(transaction.amount).toFixed(4))} ETH</td>
        </tr>
        `
    }
}