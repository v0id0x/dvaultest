$(document).ready(function() {
    let currentBatchIndex = 0;

    // Inject Batch Open Card
    const batchCard = `
        <div class="card batch-open-card">
            <h2 class="card-title">Batch Open</h2>
            <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 10px;">
                <input type="number" id="batch-size" value="10" min="1" placeholder="Size" style="width: 80px;">
                <button id="open-batch-btn" type="button" style="flex: 1;">Open Batch</button>
            </div>
             <p style="font-size: 0.8rem; color: #aaa; margin-top: 5px;">Opens links in lazy-loading tabs.</p>
        </div>
    `;
    
    // Append to control panel
    $('.control-panel').append(batchCard);

    $('#open-batch-btn').on('click', function() {
        const batchSize = parseInt($('#batch-size').val()) || 10;
        const allLinks = $('#result-list .result-card a');
        
        if (allLinks.length === 0) {
            alert("No results to open. Generate links first!");
            return;
        }

        if (currentBatchIndex >= allLinks.length) {
            alert("All links have been opened!");
            return;
        }

        const endIndex = Math.min(currentBatchIndex + batchSize, allLinks.length);
        const linksToOpen = allLinks.slice(currentBatchIndex, endIndex);
        
        let openedCount = 0;
        let blocked = false;

        linksToOpen.each(function() {
            if (blocked) return false; // Break loop if blocked

            const linkHref = $(this).attr('href');
            const resultCard = $(this).closest('.result-card');
            
            // Open in lazy loader
            const newWin = window.open(`../lazyloader.html#${linkHref}`, '_blank');

            if (!newWin || newWin.closed || typeof newWin.closed == 'undefined') {
                blocked = true;
                alert("⚠️ Popups Blocked! ⚠️\n\nBrowsers block opening multiple tabs by default.\n\nPlease check the address bar (usually right side) for a 'Popup blocked' icon, click it, and select 'Always allow popups and redirects from this site'.\n\nThen click 'Open Batch' again.");
                return false; // Break the jQuery loop
            }
            
            // Mark as visited only if successful
            if (resultCard.find('.visited-indicator').length === 0) {
                resultCard.append('<span class="visited-indicator">✔</span>');
            }
            openedCount++;
        });

        if (blocked) {
            // Only advance the index by the amount actually opened
             currentBatchIndex += openedCount;
        } else {
             currentBatchIndex = endIndex;
        }
    });

    // Reset index when Generate Links is clicked
    $('#generate-links-btn').on('click', function() {
        currentBatchIndex = 0;
    });
});
