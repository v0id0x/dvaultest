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
        
        linksToOpen.each(function() {
            const linkHref = $(this).attr('href');
            const resultCard = $(this).closest('.result-card');
            
            // Open in lazy loader
            // Assuming this script is running in dorks/something.html, so ../lazyloader.html is correct
            window.open(`../lazyloader.html#${linkHref}`, '_blank');
            
            // Mark as visited
            if (resultCard.find('.visited-indicator').length === 0) {
                resultCard.append('<span class="visited-indicator">✔</span>');
            }
        });

        currentBatchIndex = endIndex;
    });

    // Reset index when Generate Links is clicked
    $('#generate-links-btn').on('click', function() {
        currentBatchIndex = 0;
    });
});
