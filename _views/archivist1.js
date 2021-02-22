import {DEBUG} from '../common.js';

export default function App({state}) {
  return `
    <html lang=en>
      <meta charset=utf-8>
      <meta name=viewport content="width=device-width, initial-scale=1">
      <title>Dosyago</title>
      <link rel=stylesheet href=/static/style.css>
      <script src=/src/disable_on_submit.js></script>
      <script type=module>
        import {init} from '/${DEBUG.BUILD}/archivist1.js';

        self.loadData = ${JSON.stringify(state)};

        init({state:self.loadData});
      </script>
    </html>
  `
}
