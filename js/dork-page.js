function getKeywords() {
    const url = $('#url').val();
    if (!url) return;
    $.get(url, function(resp) {
        $('#keywords').val(resp);
    }).fail(function() {
        alert("Failed to fetch dorks. Check the URL and CORS policy.");
    });
}

function generateLinks(dorkType) {
    const target = $('#target').val().trim();
    if (!target) {
        alert("Please enter a target.");
        return;
    }

    $("#result-list").empty();
    const keywords = $('#keywords').val().split('\n');

    keywords.forEach(function(keyword, index) {
        if (keyword.trim() === "") return;

        const replacedKeyword = keyword.trim().replace("{target}", target);
        let link = "";
        let displayQuery = replacedKeyword;

        switch(dorkType) {
            case 'google':
                displayQuery = `site:${target} ${replacedKeyword}`
                link = `https://www.google.com/search?q=${encodeURIComponent(displayQuery)}`;
                break;
            case 'github':
                link = `https://github.com/search?q=${encodeURIComponent('"' + target + '"')}+${encodeURIComponent(replacedKeyword)}&type=Code`;
                break;
            case 'bing':
                displayQuery = `site:${target} ${replacedKeyword}`
                link = `https://www.bing.com/search?q=${encodeURIComponent(displayQuery)}`;
                break;
            case 'duckduckgo':
                link = `https://duckduckgo.com/?q=${encodeURIComponent(replacedKeyword)}`;
                break;
            case 'shodan':
                link = `https://www.shodan.io/search?query=${encodeURIComponent(replacedKeyword)}`;
                break;
            case 'fofa':
                link = `https://fofa.info/result?qbase64=${btoa(replacedKeyword)}`;
                break;
            case 'pastebin':
                displayQuery = `site:pastebin.com "${target}" ${replacedKeyword}`
                link = `https://www.google.com/search?q=${encodeURIComponent(displayQuery)}`;
                break;
            case 'yahoo':
                link = `https://search.yahoo.com/search?p=${encodeURIComponent(replacedKeyword)}`;
                break;
            case 'yandex':
                link = `https://yandex.com/search/?text=${encodeURIComponent(replacedKeyword)}`;
                break;
        }

        const resultCard = `
            <div class="result-card">
                <a href="${link}" target="_blank">${displayQuery}</a>
            </div>
        `;
        $('#result-list').append(resultCard);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const bubblesContainer = document.querySelector('.bubbles');
    if (bubblesContainer) {
        const numberOfBubbles = 20;
        for (let i = 0; i < numberOfBubbles; i++) {
            const bubble = document.createElement('div');
            bubble.classList.add('bubble');
            const size = Math.random() * 60 + 10 + 'px';
            bubble.style.width = size;
            bubble.style.height = size;
            bubble.style.left = Math.random() * 100 + 'vw';
            bubble.style.animationDuration = Math.random() * 5 + 8 + 's';
            bubble.style.animationDelay = Math.random() * 5 + 's';
            bubblesContainer.appendChild(bubble);
        }
    }

    getKeywords();

    $('#get-dorks-btn').on('click', getKeywords);

    const generateBtn = $('#generate-links-btn');
    generateBtn.on('click', function() {
        const dorkType = $(this).data('dork-type');
        generateLinks(dorkType);
    });

    $('#result-list').on('click', 'a', function() {
        const resultCard = $(this).closest('.result-card');
        if (resultCard.find('.visited-indicator').length === 0) {
            resultCard.append('<span class="visited-indicator">✔</span>');
        }
    });
});
