import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Button from './Button.vue';

describe('Vue Button', () => {
  it('渲染语义按钮并透传原生属性', () => {
    const wrapper = mount(Button, {
      attrs: {
        class: 'consumer-class',
        'data-track': 'save',
      },
      slots: {
        default: '保存',
      },
    });

    expect(wrapper.get('button').text()).toBe('保存');
    expect(wrapper.classes()).toContain('consumer-class');
    expect(wrapper.attributes('data-track')).toBe('save');
    expect(wrapper.attributes('type')).toBe('button');
  });

  it('点击时向外发出原生事件', async () => {
    const wrapper = mount(Button);

    await wrapper.trigger('click');

    expect(wrapper.emitted('click')).toHaveLength(1);
    expect(wrapper.emitted('click')?.[0]?.[0]).toBeInstanceOf(MouseEvent);
  });

  it('加载期间阻止交互并暴露忙碌状态', async () => {
    const wrapper = mount(Button, {
      props: {
        loading: true,
      },
    });

    expect(wrapper.attributes('disabled')).toBeDefined();
    expect(wrapper.attributes('aria-busy')).toBe('true');

    // 模拟外部脚本篡改 DOM，确认组件逻辑仍会阻止加载期间的程序化点击。
    wrapper.get('button').element.disabled = false;
    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toBeUndefined();
  });
});
