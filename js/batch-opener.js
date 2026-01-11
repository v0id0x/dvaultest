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
        // Convert jQuery object to standard array for easier indexing
        const linksToOpen = allLinks.slice(currentBatchIndex, endIndex).toArray();
        
        let processedCount = 0;

        function openNext(i) {
            if (i >= linksToOpen.length) {
                // All done for this batch
                currentBatchIndex += processedCount;
                return;
            }

            const linkObj = $(linksToOpen[i]);
            const linkHref = linkObj.attr('href');
            const resultCard = linkObj.closest('.result-card');

            // Open tab
            const newWin = window.open(`../lazyloader.html#${linkHref}`, '_blank');

            // Attempt to keep focus on the main page ("Open in background" style)
            // Note: Modern browsers (Chrome/Firefox) often block this to prevent pop-unders.
            // This is the best-effort solution for standard websites.
            if (newWin) {
                try {
                    newWin.blur();
                    window.focus();
                } catch (e) {
                    // Ignore focus errors
                }
            }

            // Check if blocked
            if (!newWin || newWin.closed || typeof newWin.closed == 'undefined') {
                alert("⚠️ Popup Blocked at item " + (i + 1) + "!\n\nPlease ensure you have selected 'Always allow popups...' in your browser address bar.\nThen try 'Open Batch' again to continue.");
                // Update index to start from this failed item next time
                currentBatchIndex += processedCount;
                return; 
            }

            // Success: Mark as visited
            if (resultCard.find('.visited-indicator').length === 0) {
                resultCard.append('<span class="visited-indicator">✔</span>');
            }
            
            processedCount++;

            // Small delay to prevent browser throttling (300ms)
            setTimeout(function() {
                openNext(i + 1);
            }, 300);
        }

        // Start the sequence
        openNext(0);
    });

    // Reset index when Generate Links is clicked
    $('#generate-links-btn').on('click', function() {
        currentBatchIndex = 0;
    });
});
