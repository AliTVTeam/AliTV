  use Module::Build;
  my $build = Module::Build->new
    (
     module_name => 'WgaPipeline',
     license  => 'perl',
     requires => {
                  # 'perl'          => '>=5.10.0',
                  'Log::Log4perl'  => '>=1.43',
                 },
      dist_version => '0.8',
      dist_abstract => 'Pipeline for whole genome alignment visualization',
      dist_author => 'Markus Ankenbrand'
    );
  $build->create_build_script;