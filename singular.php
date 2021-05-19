<?php
get_header();
while (have_posts()) {
    the_post();
?>
<div class="barba-container">
    <?php get_template_part('templates/topmenu') ?>
    <?php the_title(); ?>
</div>
<?php
}
get_footer();