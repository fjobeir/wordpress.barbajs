<?php
get_header();
if (have_posts()) {
?>
<div class="barba-container">
    <?php get_template_part('templates/topmenu') ?>
    <?php
    while (have_posts()) {
        the_post();
        the_title('<p>', '</p>');
    }
    ?>
</div>
<?php
}
get_footer();