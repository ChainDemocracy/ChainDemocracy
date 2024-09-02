import { TextInput } from 'flowbite-react';
import { useForm } from 'react-hook-form';

interface InviteFormType {
   walletId: string;
   bet: number;
}
export const InviteForm = ({ walletAddress }: { walletAddress: string }) => {
   const {
      register,
      handleSubmit,
      formState: { isSubmitting }
   } = useForm<InviteFormType>({
      mode: 'onBlur'
   });
   const handleClickSendInvite = async ({ walletId, bet }: InviteFormType) => {
      console.log(
         'user walletAddress',
         walletAddress,
         'walletId',
         walletId,
         'bet',
         bet
      );
   };

   const inputClassName = 'rounded-full p-2 min-w-96';

   return (
      <form onSubmit={handleSubmit(handleClickSendInvite)}>
         <div className='flex flex-col gap-4 p-8 items-center justify-center'>
            <TextInput
               type='text'
               placeholder='Enter wallet address'
               defaultValue=''
               required
               className={inputClassName}
               {...register('walletId')}
            />
            <TextInput
               type='number'
               placeholder='Enter bet value'
               defaultValue=''
               required
               className={inputClassName}
               {...register('bet')}
            />

            <button
               type='submit'
               className='w-full py-2 px-4 bg-purple-600 text-white rounded-full'
               disabled={isSubmitting}
            >
               Submit
            </button>
         </div>
      </form>
   );
};
