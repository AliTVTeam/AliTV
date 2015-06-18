  use Module::Build;
  my $build = Module::Build->new
    (
     module_name => 'AliTV',
     license  => 'perl',
     requires => {
                  # 'perl'          => '>=5.10.0',
                  'Log::Log4perl'  => '>=1.43',
                 },
      dist_version => '0.1',
      dist_abstract => 'Alignment Toolbox and Visualization',
      dist_author => 'Markus Ankenbrand'
    );
  $build->create_build_script;
