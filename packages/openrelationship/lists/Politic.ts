import { customFields, utils } from '@mirrormedia/lilith-core'
import { list } from '@keystone-6/core';
import { checkbox, select, relationship, json, timestamp, text } from '@keystone-6/core/fields';
	  
const {
  allowRoles,
  admin,
  moderator,
  editor,
  owner,
} = utils.accessControl

const listConfigurations = list ({
  fields: {
    person: relationship({
      label: '候選人-選舉',
      many: false,
      ref: 'PersonElection',
    }),
    desc: text({ 
	  label: '政見', 
	  ui: {
		displayMode: 'textarea',
	  },
	}),
    content: text({ 
	  label: '政策補充說明', 
	  ui: {
		displayMode: 'textarea',
	  },
	}),
    source: text({ 
	  label: '資料來源',
	  ui: {
		displayMode: 'textarea',
	  },
	}),
    contributer: text({ 
	  label: '資料提供',
	  ui: {
		displayMode: 'textarea',
	  },
	}),
    progress: relationship({
      label: '政見執行進度',
      many: true,
      ref: 'PoliticProgress',
    }),
	status: select({
	  options: [
	    { label: '已確認', value: 'verified' },
	    { label: '未確認', value: 'notverified' },
	  ],
	  defaultValue: 'notverified',
	  label: '狀態',
	}),
    thread_parent: relationship({
      label: '補充',
      many: false,
      ref: 'Politic',
    }),
    tag: relationship({
      label: '標籤',
      many: false,
      ref: 'Tag',
    }),
	reviewed: checkbox({
	  defaultValue: false,
	  label: '檢閱',
	}),
    // memberships: { label: "memberships", type: Relationship, many: false, ref: 'Membership' },
  },
  access: {
	operation: {
	  query: allowRoles(admin, moderator, editor),
	  update: allowRoles(admin, moderator),
	  create: allowRoles(admin, moderator),
	  delete: allowRoles(admin),
	},
  },
  hooks: {
	beforeOperation: async ({
	  operation,
	  resolvedData,
	  context,
	}) => { /* ... */ 
	  if (operation === 'create' && context.session?.data?.role === 'admin') {
		resolvedData.status = 'verified'
	  }
	},
  },
})
export default utils.addTrackingFields(listConfigurations)
