import { getExamples } from '../examples';

export default {
    name: 'Home',
    template: `
    <Page>
      <ActionBar title="Canvas Demo">
      </ActionBar>
      <ListView ref="listView"
          for="example in examples"
          rowHeight="50"
          @itemTap="goToExample">
        <v-template>
          <StackLayout padding="10" class="item" orientation="horizontal">
            <Label :text="example.component.name" fontSize="17" verticalAlignment="center"></Label>
          </StackLayout>
        </v-template>
      </ListView>
    </Page>
    `,
    data() {
        return {
            examples: getExamples()
        };
    },
    mounted() {
        // worker.onmessage = msg => {
        //     const dict = valueFromPointerNumber(NSDictionary, msg.data.value.dictionaryPtr) as NSDictionary<string, any>;
        //     const type = dict.objectForKey('type') as string;
        //     console.log('postMessageToWorker', type);
        //     switch (type) {
        //         case 'image':
        //             this.showImage(dict.objectForKey('data'));
        //             break;
        //         default:
        //             break;
        //     }
        //     (dict as any).release();
        // };
    },
    methods: {
        goToExample({ item }) {
            this.$navigateTo(item.component);
        }
    }
};
