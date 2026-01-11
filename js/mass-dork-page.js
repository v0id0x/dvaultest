$(document).ready(function() {
    $('#generate-links-btn').on('click', function() {
        const searchEngine = $('#search-engine').val();
        const dorkFormat = $('input[name="dork-format"]:checked').val();
        const dork = $('#dork').val();
        const targetsFile = $('#targets-file')[0].files[0];

        if (!dork) {
            alert('Please enter a dork.');
            return;
        }

        if (!targetsFile) {
            alert('Please select a targets file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const targets = e.target.result.split('\n').filter(target => target.trim() !== '');
            const resultList = $('#result-list');
            resultList.empty();

            targets.forEach(target => {
                let currentTarget = target.trim();

                let formattedDork;
                if (dorkFormat === 'site:target') {
                    formattedDork = `site:${currentTarget} ${dork}`;
                } else {
                    formattedDork = `"${currentTarget}" ${dork}`;
                }

                let searchUrl;

                switch (searchEngine) {
                    case 'google':
                        searchUrl = `https://www.google.com/search?q=${encodeURIComponent(formattedDork)}`;
                        break;
                    case 'bing':
                        searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(formattedDork)}`;
                        break;
                    case 'yahoo':
                        searchUrl = `https://search.yahoo.com/search?p=${encodeURIComponent(formattedDork)}`;
                        break;
                }

                const resultCard = `
                    <div class="result-card">
                        <a href="${searchUrl}" target="_blank">${formattedDork}</a>
                    </div>
                `;
                resultList.append(resultCard);
            });
        };
        reader.readAsText(targetsFile);
    });

    $('#result-list').on('click', 'a', function() {
        const resultCard = $(this).closest('.result-card');
        if (resultCard.find('.visited-indicator').length === 0) {
            resultCard.append('<span class="visited-indicator">✔</span>');
        }
    });
});
