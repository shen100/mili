let timeSortVisible = false;

$('.v-select-wrap').click(function() {
    if (!timeSortVisible) {
        $('.v-select-submit-wrap').addClass('open');
        $('.v-select-options-wrap').show();
    } else {
        $('.v-select-submit-wrap').removeClass('open');
        $('.v-select-options-wrap').hide();
    }
    timeSortVisible = !timeSortVisible;
});