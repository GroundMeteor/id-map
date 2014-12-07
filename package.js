Package.describe({
  name: 'ground:id-map',
  summary: 'Grounded idmap, can be used for offline collections - part of GroundDB',
  version: '1.0.0',
  git: ''
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.use(['ground:util@0.1.1', 'minimongo', 'id-map'], 'client');
  api.addFiles('idmap.js', 'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('ground:id-map');
  api.addFiles('idmap-tests.js', 'client');
});
